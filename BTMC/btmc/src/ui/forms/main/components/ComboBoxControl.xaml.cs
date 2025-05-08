using System.Windows;
using System.Windows.Controls;

namespace btmc.src.ui.forms.main.components
{
    public partial class ComboBoxControl : UserControl
    {
        public static readonly DependencyProperty ItemsSourceProperty =
            DependencyProperty.Register("ItemsSource", typeof(object), typeof(ComboBoxControl));

        public static readonly DependencyProperty SelectedItemProperty =
            DependencyProperty.Register("SelectedItem", typeof(object), typeof(ComboBoxControl),
                new FrameworkPropertyMetadata(null, FrameworkPropertyMetadataOptions.BindsTwoWayByDefault));

        public static readonly DependencyProperty PlaceholderTextProperty =
            DependencyProperty.Register("PlaceholderText", typeof(string), typeof(ComboBoxControl),
                new PropertyMetadata("Select an option..."));

        public object ItemsSource
        {
            get { return GetValue(ItemsSourceProperty); }
            set { SetValue(ItemsSourceProperty, value); }
        }

        public object SelectedItem
        {
            get { return GetValue(SelectedItemProperty); }
            set { SetValue(SelectedItemProperty, value); }
        }

        public string PlaceholderText
        {
            get { return (string)GetValue(PlaceholderTextProperty); }
            set { SetValue(PlaceholderTextProperty, value); }
        }

        public ComboBoxControl()
        {
            InitializeComponent();
        }

        private void ComboBox_GotFocus(object sender, RoutedEventArgs e)
        {
            placeholder.Visibility = Visibility.Collapsed;
        }

        private void ComboBox_LostFocus(object sender, RoutedEventArgs e)
        {
            placeholder.Visibility = comboBox.SelectedItem == null ? Visibility.Visible : Visibility.Collapsed;
        }
    }
}
