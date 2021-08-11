import React from 'react';
import { BaseProps, BaseSuggestions } from './BaseSuggestions';
import { DaDataAddress, DaDataAddressBounds, DaDataSuggestion } from './types';
import { HighlightWords } from './HighlightWords';

type Dictionary = { [key: string]: any };

interface Props extends BaseProps<DaDataAddress> {
  filterLanguage?: 'ru' | 'en';
  filterFromBound?: DaDataAddressBounds;
  filterToBound?: DaDataAddressBounds;
  filterLocations?: Dictionary[];
  filterLocationsBoost?: Dictionary[];
}

export class AddressSuggestions extends BaseSuggestions<DaDataAddress, Props> {
  loadSuggestionsUrl = 'https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address';

  getLoadSuggestionsData = () => {
    const { count, filterFromBound, filterToBound, filterLocations, filterLocationsBoost, filterLanguage, restrictValue } = this.props;
    const { query } = this.state;

    const requestPayload: any = {
      query,
      count: count || 10,
    };

    // Ограничение поиска по типу
    if (filterFromBound && filterToBound) {
      requestPayload.from_bound = { value: filterFromBound };
      requestPayload.to_bound = { value: filterToBound };
    }

    // Язык подсказок
    if (filterLanguage) {
      requestPayload.language = filterLanguage;
    }

    // Сужение области поиска
    if (filterLocations) {
      requestPayload.locations = filterLocations;
    }

    // Приоритет города при ранжировании
    if (filterLocationsBoost) {
      requestPayload.locations_boost = filterLocationsBoost;
    }

    if (restrictValue){
        requestPayload.restrict_value = true;
    }
    
    return requestPayload;
  }


  protected renderOption = (suggestion: DaDataSuggestion<DaDataAddress>) => {
    const { renderOption, highlightClassName } = this.props;
    const { query } = this.state;

    return renderOption ? renderOption(suggestion, query) : (
      <HighlightWords
        highlightClassName={highlightClassName || 'react-dadata--highlighted'}
        words={this.getHighlightWords()}
        text={suggestion.value}
      />
    );
  };
}
